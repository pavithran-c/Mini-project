import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import products from "../assets/fake-data/products";
import ProductCard from "../components/UI/product-card/ProductCard";
import Helmet from "../components/Helmet/Helmet";
import ReactPaginate from "react-paginate";
import "../styles/pagination.css";

const Pizzas = () => {
  const [pageNumber, setPageNumber] = useState(0);

  // Assuming `searchedProduct` can be filtered or sorted later, for now, it's just the full `products` array
  const searchedProduct = products;

  const productPerPage = 4;  // Number of products per page
  const visitedPage = pageNumber * productPerPage;  // Number of items to skip
  const displayPage = searchedProduct.slice(visitedPage, visitedPage + productPerPage);  // Products to display on the current page

  const pageCount = Math.ceil(searchedProduct.length / productPerPage);  // Total pages

  const changePage = ({ selected }) => {
    setPageNumber(selected);  // Update current page
  };

  return (
    <Helmet title="All Pizzas">
      <Container>
        <Row>
          {displayPage.map((item) => (
            <Col lg="3" md="4" sm="6" xs="6" key={item.id} className="mb-4 mt-4">
              <ProductCard item={item} />
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4 mb-4">
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={changePage}
            previousLabel={"Prev"}
            nextLabel={"Next"}
            containerClassName="paginationBttns"
            activeClassName="active"
            previousClassName="previousBtn"
            nextClassName="nextBtn"
            disabledClassName="disabledBtn"
          />
        </div>
      </Container>
    </Helmet>
  );
};

export default Pizzas;
