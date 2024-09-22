import { useState } from 'react';
import './HomePage.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FirstCarousel from '../../assets/Login.svg';
import SecondCarousel from '../../assets/Grades.svg';
import ThirdCarousel from '../../assets/Student.svg';
import LeftPart from '../../assets/left-part-background.png';
import { Carousel } from 'react-bootstrap';

const HomePage = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <div className="home-container">
            <img className='leftPart' draggable='false' src={LeftPart} alt="Office" />
            <div className="CarouselContainer">
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            style={{height: '256px'}}
                            src={FirstCarousel}
                            alt="First slide"
                            draggable='false'
                        />
                        <div className="CarouselText">
                            <h3>First Slide Label</h3>
                            <p>Some text for the first slide.</p>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            style={{height: '256px'}}
                            src={SecondCarousel}
                            alt="Second slide"
                            draggable='false'
                        />
                        <div className="CarouselText">
                            <h3>Second Slide Label</h3>
                            <p>Some text for the second slide.</p>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            style={{height: '256px'}}
                            src={ThirdCarousel}
                            alt="Third slide"
                            draggable='false'
                        />
                        <div className="CarouselText">
                            <h3>Third Slide Label</h3>
                            <p>Some text for the third slide.</p>
                        </div>
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    );
};

export default HomePage

