import React, {useEffect,useState} from 'react'
import axios from 'axios';

function Navbar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const [haveBooking, setHaveBooking] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await axios.get(`/api/bookings/isUserHaveBooking/${currentUser._id}`);
                setHaveBooking(response);
                console.log(response);
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchData();
    }, []);

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }

    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <img src="https://media.discordapp.net/attachments/1046685754375553024/1112504624482627654/image-removebg-preview_1.png" className='img-nav ' alt="Girl in a jacket" width="1.7%" height="1.7%"/>  <b> <a class="navbar-brand ml-2 H-gradient" href="/">MAYAHI HOTEL</a> </b>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"><i class='fa fa-bars' style={{color:'white'}}></i></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-5">
                        {currentUser ? (<>
                            <div class="dropdown mr-5">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class='fa fa-user m-2'></i>{currentUser.name}
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" href="/profile/1">Profile</a>
                                    <a class="dropdown-item" href="/home">Booking</a>
                                    {haveBooking==true && (<div><a class="dropdown-item" href="/food">Food Ordering</a>
                                    <a class="dropdown-item" href="/boardgame">Boardgame Borrowing</a>
                                    <a class="dropdown-item" href="/event">Event Requesting</a>
                                    <a class="dropdown-item" href="https://www.google.co.th/maps/dir/13.9508121,7.6711736//@13.9508272,7.6706595,19z?entry=ttu">Shutter Service</a></div>)}
                                    {currentUser.isAdmin && <a class="dropdown-item" href="/admin/2">Admin</a>}
                                    <a class="dropdown-item" href="/" onClick={logout}>Log out</a>
                                </div>
                            </div>
                        </>)
                            : (<>
                                <li class="nav-item active">
                                    <a class="nav-link" href="/register">Register</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/login">Login</a>
                                </li>
                            </>)}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar