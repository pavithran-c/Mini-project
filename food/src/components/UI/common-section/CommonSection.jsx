import React from "react";
import { Container } from "reactstrap";
import PropTypes from "prop-types"; // For prop validation
import "../../../styles/common-section.css";

const CommonSection = ({ title, className }) => {
  return (
    <section className={`common__section ${className}`}>
      <Container>
        <h2 className="text-white">{title}</h2>
      </Container>
    </section>
  );
};

// Setting default props in case the props are not passed
CommonSection.defaultProps = {
  title: "Default Title",
  className: "", // You can pass custom classes when using the component
};

// Adding prop types for validation
CommonSection.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

export default CommonSection;
