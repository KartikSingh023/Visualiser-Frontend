import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Pagination, Navigation } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  Area,
  Scatter,
} from "recharts";
import "./Body.css";

export default function Body() {
  const [result, setData] = useState([[{}]]);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    type: "",
    value: "",
  });

  const [pidata, setPiData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { type, value } = user;
    if (type && value && value !== "Select") {
      try {
        // const response = await axios.post("http://localhost:5000/add", user);
        const response = await axios({
          method: "post",
          url: `https://abhisekh-virtualization.onrender.com/filter`,
          params: {
            id: "",
          },
          data: user,
        });
        const obj = {
          name: response.data.value,
          value: response.data.count,
          type: response.data.type,
        };
        if (response.data.count == 0) {
          alert("No record found");
          navigate("/");
        } else {
          setPiData([...pidata, obj]);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        throw new Error("Unable to get a token.");
      }
    }
  };

  const GetData = async function () {
    // setIsLoading(true);
    setIsLoading(true);
    try {
      // const response = await axios.get("http://localhost:5000");
      const response = await axios({
        method: "get",
        url: `https://abhisekh-virtualization.onrender.com/`,
        params: {},
      });
      console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <>
      {
        <>
          {isLoading ? (
            <LoadingSpinner />
          ) : pidata.length > 0 ? (
            <div className="container-pidata">
              <div className="pidata-value d-flex justify-content-center">
                <h3>{user.type}</h3>
              </div>
              <div className="d-flex justify-content-center">
                <ComposedChart
                  width={500}
                  height={400}
                  data={pidata}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="#ffffff" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="#8884d8"
                    stroke="#8884d8"
                  />
                  <Bar dataKey="value" barSize={20} fill="#413ea0" />
                  <Line type="monotone" dataKey="value" stroke="#ff7300" />
                  <Scatter dataKey="value" fill="red" />
                </ComposedChart>
              </div>
              <div className="text-center p-5">
                <button
                  type="button"
                  onClick={() => {
                    setPiData([]);
                    navigate("/");
                  }}
                  class="pidata-btn btn btn-info"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="container">
              <form className="form-box" onSubmit={onFormSubmit}>
                <div className="row">
                  <div className="col-md-4 p-3">
                    <select
                      className="form-select"
                      value={user.type}
                      onChange={handleChange}
                      name="type"
                      id="floatingSelectGrid"
                      aria-label="Floating label select example"
                    >
                      <option selected>Select</option>
                      <option value="Intensity">Intensity</option>
                      <option value="Likelihood">Likelihood</option>
                      <option value="Relevance">Relevance</option>
                      <option value="Year">Year</option>
                      <option value="Country">Country</option>
                      <option value="Topics">Topics</option>
                      <option value="Region">Region</option>
                      <option value="City">City</option>
                    </select>
                  </div>
                  <div className="col-md-4 p-3">
                    <input
                      type="text"
                      name="value"
                      autoComplete="off"
                      value={user.value}
                      onChange={handleChange}
                      className="form-control"
                      id="floatingInputGrid"
                      placeholder="Enter the value"
                    />
                  </div>
                  <div className="col-md-4 p-3 text-center">
                    <button type="submit" class="btn btn-dark ms-auto">
                      Apply Filter
                    </button>
                  </div>
                </div>
              </form>
              <Swiper
                className="container testimonials__container"
                modules={[Navigation, Pagination]}
                spaceBetween={40}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
              >
                <div className=" col d-flex justify-content-center">
                  {result &&
                    result.map((item) => {
                      return (
                        <div className="row">
                          <SwiperSlide key={item.key} className="testimonial">
                            <div className="heading d-flex justify-content-center">
                              <h5>{item.type}</h5>
                            </div>
                            <BarChart
                              width={500}
                              height={300}
                              data={item.data}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                              className="row1"
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="value" fill="#8884d8" />
                              {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                            </BarChart>
                          </SwiperSlide>
                        </div>
                      );
                    })}
                </div>
              </Swiper>
            </div>
          )}
        </>
      }
    </>
  );
}
