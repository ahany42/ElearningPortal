import { useState, useContext } from 'react';
import './HomePage.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import LeftPart from '../../assets/left-part-background.png';
import { Carousel } from 'react-bootstrap';
import { CurrentUserContext } from '../../App';
import Front_ENV from "../../../Front_ENV.jsx";
import styled from "styled-components";
import CoursePlaceHolder from "../../assets/Course_Placeholder.svg";

const CarouselItemDiv = styled.div`
      &::before {
          content: "";
          background-image: url(${props => props.$image? `${Front_ENV.Back_Origin}/${props.$image}` : CoursePlaceHolder});
          background-size: contain;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          border-radius: 30px;
          margin: 4px 8px;
      }
`;

const HomePage = () => {
  const { courses } = useContext(CurrentUserContext);

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
          <Carousel interval={null}>
            {
              [...courses].splice(courses.length - 3, 3)
                  .map((course) => {
                    return (
                        <Carousel.Item key={course.id}>
                          {/*<img*/}
                          {/*    className="d-block w-100"*/}
                          {/*    style={{width: "100%"}}*/}
                          {/*    src={`${Front_ENV.Back_Origin}/${course.image.replaceAll("\\", "/")}`}*/}
                          {/*    alt="First slide"*/}
                          {/*    draggable="false"*/}
                          {/*/>*/}
                          <CarouselItemDiv $image={course.image ? course.image.replaceAll("\\", "/") : ""}
                                           className="background-image-item w-100"></CarouselItemDiv>
                          <div className="CarouselText">
                            <h3>{course.title}</h3>
                          </div>
                        </Carousel.Item>
                    )
                  })
            }
          </Carousel>
        </div>
      </div>
  );
};

export default HomePage

