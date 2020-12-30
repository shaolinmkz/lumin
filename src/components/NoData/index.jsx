import React from "react";
import "./index.scss";
import noDataSvg from '../../assets/no-data.svg'

const NoData = () => {
  return (
    <div className="no-data">
      <section>
        <img src={noDataSvg} alt="" />
        <p>No products found</p>
      </section>
    </div>
  );
};

export default NoData;
