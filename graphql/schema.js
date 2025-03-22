const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');
const Inventory = require('../models/Inventory');
const yup = require('yup');

// Validation Schema
const inventoryValidationSchema = yup.object({
    name: yup.string().required(),
    category: yup.string().required(),
    quantity: yup.number().required().min(1),
    price: yup.number().required().min(0),
});

// Inventory Type
const InventoryType = new GraphQLObjectType({
    name: 'Inventory',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        price: { type: GraphQLInt },
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        inventory: {
            type: InventoryType,
            args: { id: { type: GraphQLString } },
            async resolve(parent, args) {
                return await Inventory.findById(args.id);
            }
        },
        inventories: {
            type: new GraphQLList(InventoryType),
            async resolve() {
                return await Inventory.find();
            }
        }
    }
});

// Mutations (POST & PUT with validation)
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add Inventory (POST)
        addInventory: {
            type: InventoryType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: new GraphQLNonNull(GraphQLString) },
                quantity: { type: new GraphQLNonNull(GraphQLInt) },
                price: { type: new GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args) {
                try {
                    await inventoryValidationSchema.validate(args);
                    const inventory = new Inventory(args);
                    return await inventory.save();
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        },
        // Update Inventory (PUT)
        updateInventory: {
            type: InventoryType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                category: { type: GraphQLString },
                quantity: { type: GraphQLInt },
                price: { type: GraphQLInt },
            },
            async resolve(parent, args) {
                try {
                    await inventoryValidationSchema.validate(args, { abortEarly: false });
                    return await Inventory.findByIdAndUpdate(args.id, args, { new: true });
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
