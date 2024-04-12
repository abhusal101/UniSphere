import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// creating archieve api endpoint
export const archive = mutation ({
    args: { id: v.id("documents") }, // pass the argument id of the document we want to archive
    handler: async (ctx, args) => {
        // checking the identity
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        // fetch the document using the above id
        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Not Found");
        }

        // checking if the userid matches the currently logged in user
        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorised");
        }

        const recursiveArchive = async (documentId: Id<"documents">) => {
            //fetching all the children which have that id as their parent id 
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            // archive all the children
            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });

                // checking if the children have children or not
                await recursiveArchive(child._id);
            }
        }

        //change/arhive the document
        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });

        // after the document is archived, passing the document id inside the recursive function
        recursiveArchive(args.id);

        return document;
    }
})

export const getSidebar = query ({
    args: {
        parentDocument: v. optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>
                q
                    .eq("userId", userId)
                    .eq("parentDocument", args.parentDocument)
            )
            .filter((q) =>
                q.eq(q.field("isArchived"), false)
            )
            .order("desc")
            .collect();
        
        return documents;
    },
});

export const create = mutation({
    args:{
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });

        return document;
    }
});

export const getTrash = query ({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
        
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user" , (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("isArchived"), true)
            )
            .order("desc")
            .collect();

        return documents;
    }
});

// restore the docs from recycle bin
export const restore = mutation ({
    args: { id: v.id("documents") },
    handler: async (ctx, args) =>{
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Not Found");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorised");
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                });

                await recursiveRestore(child._id);
            }
        }

        const options: Partial<Doc<"documents">> ={
            isArchived: false,
        };

        //if our document has a parent document
        if (existingDocument.parentDocument) {
            const parent = await ctx.db.get(existingDocument.parentDocument);
            if(parent?.isArchived) {
                options.parentDocument = undefined;
            }
        }

        const document = await ctx.db.patch(args.id, options);

        recursiveRestore(args.id);

        return document;
    }
});

// actual forever remove mutation
export const remove = mutation({
    args: { id: v.id("documents")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Not Found");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorised");
        }

        const document = await ctx.db.delete(args.id);

        return document;
    }
});