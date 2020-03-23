import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import "firebase/auth";
import "firebase/firestore";
import * as firebase from "firebase/app";
import { firebaseConfig } from "../index";
import { Button, Container, Row, Col } from 'react-bootstrap';


function loginSuccess(values) {
    return {
        type: 'ADD_LOGIN_DETAILS',
        values
    }
}

const Login = props => {
    const login = values => {
        var provider = new firebase.auth.GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().signInWithRedirect(provider);
    }

    const checkLogin = () => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                /*  user.getIdToken().then((res)=>{
                    console.log(res)
                  }).catch(err=>{
                    console.error(err)
                  })*/
                props.onLoginSuccess({ user, token: null });
            }
        });
    }

    const logout = () => {
        firebase.auth().signOut().then(function (result) {
            alert('Signed Out')
            props.onLoginSuccess({ user: '', token: '' });
        }).catch(function (error) {
            console.error(error)
        });
    }

    useEffect(() => {
        window.fbInstance = firebase.initializeApp(firebaseConfig);
        checkLogin();
    }, []);

    return (
        <div>
            {props.user ?
                <Container>
                    <Row>
                        <Col sm={9}>
                            <p className='h6 mt-2' style={{ color: 'white' }}>
                                <small class="text-muted">Welcome Brother</small>
                                {' ' + props.user.displayName}
                            </p>
                        </Col>
                        <Col sm={3}>
                            {props.user ?
                                <Button className='float-right' onClick={logout}>Logout</Button> :
                                <Button className='float-right' onClick={login}>Login</Button>
                            }
                        </Col>
                    </Row>
                </Container> :
                <Button onClick={login}>Login</Button>
            }
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.login.user
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLoginSuccess: (values) => {
            dispatch(loginSuccess(values))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)
