import React, { useEffect } from 'react'
import Axios from 'axios';
import { withRouter } from "react-router-dom"

function LandingPage(props) {
    useEffect(() => {
        Axios.get('/api/hello')
        .then(res => console.log(res))
    }, [])

    const onClickHandler = () => {
        Axios.get("/api/logout")
            .then(res=>{
                if(res.data.success) {
                    props.history.push("/login");
                } else {
                    alert("logout failed")
                }
            })
    }
    return (
        <div style={{
            display:'flex', justifyContent:'center', alignItems:'center', 
            width:'100%', height :'100vh'
        }}>

            <h2>시작 페이지</h2>'
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage)
