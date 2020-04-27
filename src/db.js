const userData = [{
    id: '123',
    name: 'abhineet',
    email: 'abhi@s.com',
    age: 29,

}, 
{
    id: '1',
    name: 'raj',
    email: 'abhi@s4.com',
    age: 23
},
{
    id: '2',
    name: 'ram',
    email: 'abhi@s5.com',
    age: 22
}]

var postData = [{
    id: '234',
    title: 'post title',
    body: 'body post',
    published: false,
    author: "1"
},
{
    id: '2334',
    title: 'post3 title',
    body: 'body3 post',
    published: false,
    author: "2"
}]

const commentData = [{
    id: '234',
    text: 'post title',
    
},
{
    id: '2334',
    text: 'post3 title',
  
}]

export const db = {
    commentData,
    postData,
    userData
}