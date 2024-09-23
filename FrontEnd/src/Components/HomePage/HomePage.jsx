import { useState } from 'react';
import './HomePage.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FirstCarousel from '../../assets/react.webp';
import SecondCarousel from '../../assets/node.webp';
import ThirdCarousel from '../../assets/mongo.webp';
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
        <img
          className="leftPart"
          draggable="false"
          src={LeftPart}
          alt="Office"
        />
        <div className="CarouselContainer">
          <h4 className="alignCenter-text extraBold-text">Top Courses</h4>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                style={{ height: "256px" }}
                src={FirstCarousel}
                alt="First slide"
                draggable="false"
              />
              <div className="CarouselText">
                <h3>Learn React</h3>
                <p>
                  Master front-end development with the most popular JavaScript
                  library.
                </p>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                style={{ height: "256px" }}
                src={SecondCarousel}
                alt="Second slide"
                draggable="false"
              />
              <div className="CarouselText">
                <h3>Node.js Essentials</h3>
                <p>
                  Build fast and scalable back-end applications with Node.js.
                </p>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                style={{ height: "256px" }}
                src={ThirdCarousel}
                alt="Third slide"
                draggable="false"
              />
              <div className="CarouselText">
                <h3>Master MongoDB</h3>
                <p>
                  Store and manage data effectively with this powerful NoSQL
                  database.
                </p>
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    );
};

export default HomePage

