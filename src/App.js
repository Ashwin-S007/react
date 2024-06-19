import Header from "./Header";
import Nav from "./Nav";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import Footer from "./Footer";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "./api/posts";
import Editpost from "./Editpost";
import useWindowsize from "./hooks/useWindowsize";
function App() {
  const [posts, setPosts] = useState([
    {
      "id": "2",
      "title": "Second post",
      "datetime": "July 16, 2021 11:47:48 AM",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. two"
    },
    {
      "id": "3",
      "title": "Number Three",
      "datetime": "July 16, 2021 11:48:01 AM",
      "body": "Third post... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      "id": "411",
      "title": "React Js",
      "datetime": "June 19, 2024 12:58:54 PM",
      "body": "Fully Finished...!!!!"
    },
    {
      "id": "4111",
      "title": "Github",
      "datetime": "June 19, 2024 1:49:34 PM",
      "body": "Onto Next...!!!"
    },
    {
      "id": "41111",
      "title": "Sem Holidays",
      "datetime": "June 19, 2024 1:50:04 PM",
      "body": "Practicing for the Job Interviews..."
    },
    {
      "id": "411111",
      "title": "My First Post",
      "datetime": "June 19, 2024 4:02:25 PM",
      "body": "aswin"
    }
  ])
  const [search, setSearch] = useState("")
  const [searchResults, setSearchresults] = useState([])
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate()
  const {width} = useWindowsize()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error : ${err.message}`);
        }
      } 
    }
  }, [])

  useEffect(() => {
    const filteredResults = posts.filter((post) =>
    ((post.body).toLowerCase()).includes(search.toLowerCase()) 
    || ((post.title).toLowerCase()).includes(search.toLowerCase()));

    setSearchresults(filteredResults.reverse());
  }, [posts, search])

  const handleSubmit = async (e) => {
        e.preventDefault();
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = { id, title: postTitle, datetime, body: postBody };
        try{
          const allPosts = [...posts, newPost];
          setPosts(allPosts);
          setPostTitle('');
          setPostBody('');
          navigate('/')
        } catch(err) {
          if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
          } else {
            console.log(`Error : ${err.message}`);
          }
        }
    }

    const handleEdit = async (id) => {
      const datetime = format(new Date(), 'MMMM dd, yyyy pp');
      const updatedPost = { id, title: editTitle, datetime, body: editBody };
      try {
        setPosts(posts.map(post => post.id === id ? {...updatedPost} : post));
        setEditTitle('');
        setEditBody('');
        navigate('/')

      }catch(err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error : ${err.message}`);
        }
      }
    }

    const handleDelete = async (id) => {
      try{
        const postsList = posts.filter(post => post.id !== id);
        setPosts(postsList);
        navigate('/')
      }catch(err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error : ${err.message}`);
        }
      }
    }

  return (
    <div className="App">
        <Header  title="Together Social Media" width = {width}/>
        <Nav search={search}
          setSearch={setSearch} />
        <Routes>
          <Route path="/" element = {<Home posts ={searchResults} />}/>
          <Route path="post">
            <Route index element = {<NewPost
                handleSubmit={handleSubmit}
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postBody={postBody}
                setPostBody={setPostBody}
                />} />
            <Route path = ":id" element={<PostPage posts={posts} handleDelete={handleDelete} />}/>
          </Route>
          <Route path= "/edit/:id" element= {<Editpost posts={posts} 
          handleEdit={handleEdit} 
          editBody={editBody} 
          setEditBody={setEditBody} 
          editTitle={editTitle} 
          setEditTitle={setEditTitle} />} />
          <Route path="about" element = {<About />} />
          <Route path="*" element={<Missing />} />
        </Routes>
        <Footer /> 
    </div>
  );
}

export default App;
