import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const autoCreateUser = mutation({
  args: { address: v.string() },
  handler: async (ctx, args) => {
    const normalizedAddress = args.address.toLowerCase();
    const existingUser = await ctx.db
      .query("user")
      .withIndex("by_address", (q) => q.eq("address", normalizedAddress))
      .unique();
    if (existingUser) {
      console.log("User already exists");
    } else {
      const userId = await ctx.db.insert("user", {
        address: normalizedAddress,
        userName: `Crazy_For_${args.address.slice(-6)}`,
        role: "user",
      });
      console.log(`Created user with ID ${userId}`);
    }
  },
});

export const getUser = query({
  args: { address: v.string() },
  handler: async (ctx, args) => {
    const normalizedAddress = args.address.toLowerCase();
    const user = await ctx.db
      .query("user")
      .withIndex("by_address", (q) => q.eq("address", normalizedAddress))
      .unique();
    return user;
  },
});

export const updateUserName = mutation({
  args: { address: v.string(), newUserName: v.string() },
  handler: async (ctx, args) => {
    const normalizedAddress = args.address.toLowerCase();
    // Check if the user exists
    const existingUser = await ctx.db
      .query("user")
      .withIndex("by_address", (q) => q.eq("address", normalizedAddress))
      .unique();

    if (!existingUser) {
      throw new Error("User not found.");
    }

    await ctx.db.patch(existingUser._id, {
      userName: args.newUserName,
    });

    console.log(`Updated username for user ${normalizedAddress}`);
  },
});
