import {GraphQLServer, PubSub} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

import {db} from './db'

const pubSub = new PubSub()

//resolver
const resolvers = {
    Query: {
        comments(parents, args, {db}, info) {
            return db.commentData
        },
        add(parents, args, ctx, info) {
            if(args.number.length === 0) {
                return 0
            } else {
                return args.number.reduce((acc, curr) => acc + curr, 0)
            }
        },
        greeting(parents, args, ctx, info) {
            if(args.name) {
                return args.name
            } else {
                return 'hello abhineet'
            }
        },
        grades(parents, args, ctx, info) {
            return [99, 10]
        },
        users(parents, args, {db}, info) {
            if(!args.query) {
                return db.userData
            }
            return db.userData.filter((user, i) => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parents, args, {db}, info) {
            if(!args.query) {
                return db.postData
            }
            return db.postData.filter((post, i) => post.title.toLowerCase().includes(args.query.toLowerCase()))
        },
        id() {
            return 'learning graphql'
        },
        name() {
            return 'name abhineet'
        },
        age() {
            return 23
        },
        employed() {
            return true
        },
        gpa() {
            return null
        },
        me() {
            return {
                id: '123',
                name: 'abhineet',
                email: 'abhi@s.com',
                age: 29
            }
        },
        post() {
            return {
                id: '234',
                title: 'post title',
                body: 'body post',
                published: false
            }
        }
    },
    Mutation: {
        creatUser(parents, args, {db}, info) {
                const emailTaken = db.userData.some((user, i ) => user.email === args.email)
                if(emailTaken) {
                    throw new Error('Email taken')
                } 
                const user = {
                    id: uuidv4(),
                    ...args.data
                }
                db.userData.push(user)
                return user
        },
        creatPost(parents, args, {db, pubSub}, info) {
            const userExists = db.userData.some((user, i ) => user.id === args.data.author)
            if(!userExists) {
                throw new Error('user not exists')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }
            db.postData.push(post);
            pubSub.publish('post', {
                posts: post
            })
            return post
        },
        deleteUser(parents, args, {db}, info) {
            const userIndex = db.userData.findIndex((user) => user.id===args.id)
            if(userIndex === -1) {
                throw new Error('id mismatch')
            }
            db.postData = db.postData.filter((post, i) => {
               const match =  post.author === args.id;
               return !match
            })
            return db.userData.splice(userIndex, 1)[0]
        }
    },
    Subscription: {
        count: {
            subscribe(parents, args, {pubSub}, info){
                let count = 0;
                setInterval(() => {
                    count++;
                    pubSub.publish('Channel', {
                        count: count 
                    })
                }, 1000)

                return pubSub.asyncIterator('Channel')
            }
        },
        posts: {
            subscribe(parents, args, {pubSub}, info) {
                return pubSub.asyncIterator('post')
            }
        }
    },
    Post: {
        author(parents, args, {db}, info) {
            return db.userData.find(user => user.id === parents.author)
        }
    },
    User: {
        posts(parents, args, {db}, info) {
            return db.postData.filter((post, i) => post.author === parents.id)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db,
        pubSub
    }
})

server.start(() => {
    console.log('server started')
})
