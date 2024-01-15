import React, { useEffect, useState } from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import tronLinkIcon from "../../../assets/icons/tronLinkIcon.png";
import styles from "./transactions.module.css";
import searchIcon from "../../../assets/icons/searchIcon.png";
import "bootstrap/js/src/collapse.js";
import CustomAccordion from "./CustomAccordion";
import {
  ROUTES,
  FILTERS,
  STATUS_CODES,
  API_METHODS,
  DEALS_PER_PAGE,
} from "../../../utils/constants.utils";
import Pagination from "../../../components/Pagination";
import { useFormik } from "formik";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "../../../context/authContext";
import { RxCrossCircled } from "react-icons/rx";
import { APIcall } from "../../../utils/helper.utils";

const Transactions = () => {
  const [active, setActive] = useState(null);
  const { user } = useAuth();
  const [acceptedcurrentPage, setAcceptedCurrentPage] = useState(0);
  const [createdCurrentPage, setCreatedCurrentPage] = useState(0);
  const [acceptedSearchPage, setAcceptedSearchPage] = useState(0);
  const [createdSearchPage, setCreatedSearchPage] = useState(0);
  const [createdDeals, setCreatedDeals] = useState([]);
  const [acceptedDeals, setAcceptedDeals] = useState([]);
  const [createdtotalPages, setCreatedTotalPages] = useState(0);
  const [acceptedTotalPages, setAcceptedTotalPages] = useState(0);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const paginate = (pageNumber) => setCreatedCurrentPage(pageNumber);
  const searchPaginate = (pageNumber) => setCreatedSearchPage(pageNumber);

  const acceptedPaginate = (pageNumber) => setAcceptedCurrentPage(pageNumber);
  const acceptedSearchPaginate = (pageNumber) =>
    setAcceptedSearchPage(pageNumber);
  const formik = useFormik({
    initialValues: {
      searchValue: "",
    },
    onSubmit: async (values) => {
      if (values.searchValue?.length > 2) {
        const body = {
          searchValue: values.searchValue,
          wallet_address: user,
          filter: FILTERS.CREATED,
        };
        const acceptedDealsBody = {
          searchValue: values.searchValue,
          wallet_address: user,
          filter: FILTERS.ACCEPTED,
        };
        const params = {
          page_num: createdSearchPage + 1,
          record_limit: DEALS_PER_PAGE,
        };
        const acceptedParams = {
          page_num: acceptedSearchPage + 1,
          record_limit: DEALS_PER_PAGE,
        };
        await APIcall(API_METHODS.POST, ROUTES.TRONDEALS.searchDeal, body, {
          params: params,
        })
          .then(function (response) {
            setCreatedDeals(response?.data?.data?.search_list);
            setCreatedTotalPages(response?.data?.data?.total_pages);
          })
          .catch(function (error) {
            if (error?.response?.status === STATUS_CODES.NOT_FOUND) {
              setCreatedDeals([]);
            } else {
              console.log(error);
            }
          });
        await APIcall(
          API_METHODS.POST,
          ROUTES.TRONDEALS.searchDeal,
          acceptedDealsBody,
          {
            params: acceptedParams,
          }
        )
          .then(function (response) {
            setAcceptedDeals(response?.data?.data?.search_list);
            setAcceptedTotalPages(response?.data?.data?.total_pages);
          })
          .catch(function (error) {
            if (error?.response?.status === STATUS_CODES.NOT_FOUND) {
              setAcceptedDeals([]);
            } else {
              console.log(error);
            }
          });
      }
    },
  });
  const getDeals = async () => {
    await APIcall(API_METHODS.GET, ROUTES.TRONDEALS.getDeals, {
      params: {
        wallet_address: user,
        page_num: createdCurrentPage + 1,
        record_limit: DEALS_PER_PAGE,
        filter: FILTERS.CREATED,
      },
    })
      .then(async function (response) {
        setCreatedDeals(response?.data?.data?.deal_list);
        setCreatedTotalPages(response?.data?.data?.total_pages);
        setIsLoading(false);
      })
      .catch(function (error) {
        setIsLoading(false);
        if (error?.response?.status === STATUS_CODES.NOT_FOUND) {
          setCreatedDeals([]);
        } else {
          console.log(error);
        }
      });
    await APIcall(API_METHODS.GET, ROUTES.TRONDEALS.getDeals, {
      params: {
        wallet_address: user,
        page_num: acceptedcurrentPage + 1,
        record_limit: DEALS_PER_PAGE,
        filter: FILTERS.ACCEPTED,
      },
    })
      .then(function (response) {
        setAcceptedDeals(response?.data?.data?.deal_list);
        setAcceptedTotalPages(response?.data?.data?.total_pages);
        setIsLoading(false);
      })
      .catch(function (error) {
        setIsLoading(false);
        if (error?.response?.status === STATUS_CODES.NOT_FOUND) {
          setAcceptedDeals([]);
        } else {
          console.log(error);
        }
      });
  };

  const handleGoBack = () => {
    setIsLoading(true);
    getDeals();
    formik.setFieldValue("searchValue", "");
  };

  useEffect(() => {
    setIsLoading(true);
    getDeals();
  }, [createdCurrentPage, acceptedcurrentPage, user, updateStatus]);

  useEffect(() => {
    formik.handleSubmit();
  }, [createdSearchPage, acceptedSearchPage]);

  const TableHeader = ({ createdDeals }) => {
    return (
      <div className={`row`} id="heading">
        <div className={`col-2 ${styles.title}`}>Title</div>
        <div className={`col-3 ${styles.title}`}>Date & Time</div>
        <div className={`col-2 ${styles.title}`}>Amount</div>
        <div className={`col-3 ${styles.title}`}>
          {createdDeals ? "Seller Address" : "Buyer Address"}
        </div>
        <div className={`col-2 ${styles.title}`}>Status</div>
      </div>
    );
  };
  return (
    <React.Fragment>
      <SideBar activeProp="Transactions" />
      <Header account={user} walletIcon={tronLinkIcon} />
      <div className={styles.main}>
        <div className={`${styles.heading} mt-3 ms-3 mb-2`}>
          <div className={`${styles.search} me-3`}>
            <img className={styles.searchIcon} src={searchIcon} />
            <form onSubmit={formik.handleSubmit} className={styles.formWidth}>
              <input
                type="text"
                className={`${styles.noBorder} form-control shadow-none`}
                placeholder="Search by Title/ Description/ Wallet Address/ Transaction Hash"
                name="searchValue"
                value={formik.values.searchValue}
                onChange={formik.handleChange}
              />
              <button type="submit" style={{ display: "none" }}></button>
            </form>
            {formik.values.searchValue && (
              <div className={styles.goBack} onClick={handleGoBack}>
                <RxCrossCircled />
              </div>
            )}
          </div>
        </div>
        <div
          className={`${styles.heading} text-decoration-underline mt-2 mb-2`}
        >
          <span>Created Deals</span>
        </div>
        <div
          className={`${styles.divWidth} accordion accordion-flush`}
          id="accordionFlushExample"
        >
          <div className={styles.tablewrap}>
            {createdDeals?.length > 0 ? (
              <>
                <TableHeader createdDeals={true} />
                {isLoading && (
                  <Spinner
                    animation="border"
                    style={{ height: "80px", width: "80px" }}
                    size="lg"
                    role="status"
                  ></Spinner>
                )}
                {createdDeals.map((obj, index) => {
                  return (
                    <CustomAccordion
                      key={obj?.id}
                      obj={obj}
                      onClick={() => {
                        setActive(obj.id);
                      }}
                      className={`${active === obj.id ? styles.border : ""}`}
                      createdDeals={true}
                      updateStatus={() => {
                        setUpdateStatus(!updateStatus);
                      }}
                    />
                  );
                })}
                {createdDeals.length !== 0 && createdtotalPages > 1 && (
                  <Pagination
                    paginate={
                      formik.values.searchValue ? searchPaginate : paginate
                    }
                    currentPage={
                      formik.values.searchValue
                        ? createdSearchPage
                        : createdCurrentPage
                    }
                    totalPages={createdtotalPages}
                  />
                )}
              </>
            ) : (
              !isLoading && (
                <div className="display-6 m-5">No Deals Available</div>
              )
            )}
          </div>
          <div
            className={`${styles.heading} text-decoration-underline mt-5 mb-2`}
          >
            Accepted Deals
          </div>
          <div className={styles.tablewrap}>
            {acceptedDeals?.length > 0 ? (
              <>
                <TableHeader createdDeals={false} />
                {isLoading && (
                  <Spinner
                    animation="border"
                    style={{ height: "80px", width: "80px" }}
                    size="lg"
                    role="status"
                  ></Spinner>
                )}
                {acceptedDeals.map((obj, index) => {
                  return (
                    <CustomAccordion
                      index={index}
                      obj={obj}
                      onClick={() => {
                        setActive(obj.id);
                      }}
                      className={`${active === obj.id ? styles.border : ""}`}
                      updateStatus={() => {
                        setUpdateStatus(!updateStatus);
                      }}
                    />
                  );
                })}
                {acceptedDeals?.length !== 0 && acceptedTotalPages > 1 && (
                  <Pagination
                    paginate={
                      formik.values.searchValue
                        ? acceptedSearchPaginate
                        : acceptedPaginate
                    }
                    currentPage={
                      formik.values.searchValue
                        ? acceptedSearchPage
                        : acceptedcurrentPage
                    }
                    totalPages={acceptedTotalPages}
                  />
                )}
              </>
            ) : (
              !isLoading && (
                <div className="display-6 m-5">No Deals Available</div>
              )
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Transactions;
