import React from "react";
import { connect } from "react-redux";
import { pictureAndFact } from "../reducers";

function MainPage(props){

    React.useEffect(() => {
        props.pictureAndFact(props.breeds);
    },[]);

    return <div>
        <img src={props.pic} height="300px"/>
        <h2 width="500px">{props.fact}</h2>
        {" "}
        <button onClick={()=>{props.pictureAndFact(props.breeds)}}>New Fact</button>
    </div>
}

function mapStateToProps(state){
    return {
        fact: state.fact,
        pic: state.pic,
    };
};

function mapDispatchToProps(dispatch){
    return {
        pictureAndFact: () => dispatch(pictureAndFact())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage)