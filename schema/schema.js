const graphql = require('graphql');
const _ = require('lodash');

const Book = require('../models/book');
const Author = require('../models/author');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull 
} = graphql;


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({ authorId: parent.id });
               
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // code to get data from db / other source
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Author.findById(args.id);
            }
        },
        books : {
            type : new GraphQLList(BookType),
            resolve(parent ,args){
                return Book.find();
            }
        },
        authors : {
            type : new GraphQLList(AuthorType),
            resolve(parent , aggs){
                return Author.find();
            }
        }
    }
});


// update delete add
const Mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        addAuthor:{
            type : AuthorType,
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)},
                age : {type : GraphQLInt}
            },
            resolve(parent ,args){
                // new Author is the mongooes model import 
                let author = new Author(
                    {
                        name : args.name,
                        age : args.age
                    }
                );

               return author.save(); // add new record to mongo db 
            }
        },
        addBook : {
            type : BookType,
            args : {
               name : {type : GraphQLString},
               genre : {type : GraphQLString},
               authorId : {type :GraphQLID}
           },
           resolve(parent , args){
               let book = new Book({
                   name : args.name,
                   genre :args.genre,
                   authorId :args.authorId
               })
               return book.save();
           }
        },
        removeBook : {
            type : BookType,
            args : {
               id : {type :GraphQLID}
           },
           resolve(parent , args){
             let removedBook = Book.findByIdAndDelete(args.id).exec(); //

             return removedBook.message = "new one "
           }
        },
        updateBook : {
            type : BookType,
            args : {
               id : {type :GraphQLID},
               name: {type : new GraphQLNonNull(GraphQLString)},
               genre : { type : GraphQLString}
           },
           resolve(parent , args){
               let updateObj ={
                   name : args.name,
                   genre : args.genre
               }
              return Book.findByIdAndUpdate(args.id , updateObj).exec(); //
           }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation : Mutation
});