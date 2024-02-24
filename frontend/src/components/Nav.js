import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkTokenExpiration, handleLogout, selectIsLoggedIn, selectUsername } from '../features/login/loginSlice'
import MyCart from '../features/prods/MyCart'
import { selectCartVisibility, toggleCartVisibility } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'

const Nav = () => {
    const cartVisible = useSelector(selectCartVisibility);
    const logged = useSelector(selectIsLoggedIn)
    const username = useSelector(selectUsername)
    const dispatch = useDispatch()
    

    const toggleCart = (event) => {
        event.stopPropagation(); // Stop the event from bubbling up (handleClickOutside function)
        dispatch(toggleCartVisibility());
    };


    //when the logout link is clicked, an action is dispatched with useDispatch() to update the Redux store, which will then update the state logged to false.
    const handleLogoutClick = () => {
        dispatch(handleLogout());
        toast.success('Logged out successfully!');
    }

    useEffect(() => {
        // Dispatch action to check token expiration on page load
        dispatch(checkTokenExpiration());

        // Set up interval to periodically check token expiration
        const intervalId = setInterval(() => {
            dispatch(checkTokenExpiration());
        }, 60000); // Check every 60 seconds

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [dispatch]);


    useEffect(() => {
    if (cartVisible) {
        const handleClickOutside = (event) => {
            const cartContainer = document.querySelector('.cart-container');
            if (cartContainer && !cartContainer.contains(event.target)) {
                console.log('Clicked outside the cart container');
                dispatch(toggleCartVisibility());
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }
}, [cartVisible, dispatch]);


    

    return (
        <div>
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link to='/' className="navbar-brand"><img src="NavLogoMarket1.jpg" alt="Logo" style={{ width: "79px", marginTop: "-17px" }} /></Link>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav">
                            <li className="active"><Link to='/' className="navbar-brand">Home</Link></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><Link onClick={(event) => toggleCart(event)}><span className="glyphicon glyphicon-shopping-cart"></span> Cart</Link></li>
                            {!logged && <li><Link to="/register"><span className="glyphicon glyphicon-log-in"></span> Register</Link></li>}
                            {logged && <li><Link to="/profile"><span className="glyphicon glyphicon-user"></span> {username}</Link></li>}
                            {!logged ? <li><Link to="/login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li> : <li><Link onClick={() => handleLogoutClick()}><span className="glyphicon glyphicon-log-in"></span> Logout</Link></li>}
                        </ul>
                    </div>
                </div>
            </nav>
            {cartVisible && <MyCart />}
        </div>
    )
}

export default Nav