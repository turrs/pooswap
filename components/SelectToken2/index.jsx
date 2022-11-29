import Image from "next/image";
import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../../context";

import { Axios, ListToken } from "../../utils";

const SelectToken2 = ({ token }) => {
  const {
    setTokenOneImage,
    setTokenOneName,
    setTokenTwoImage,
    setTokenTwoName,
    setTokenTwoDecimals,
    setContractTokenTwo,
  } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [tokenPairOne, setTokenPairOne] = useState();
  const [tokenPairTwo, setTokenPairTwo] = useState();
  const [listtokenPair, setListTokenPair] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchTokenList = async () => {
    const res = await ListToken.get("").then((result) => {
      setListTokenPair(result.data.tokens);
    });
  };
  const selectId = (symbol, logo, contract, decimals) => {
    setTokenTwoName(symbol);
    setTokenTwoImage(logo);
    setContractTokenTwo(contract);
    setTokenTwoDecimals(decimals);
    setShowModal(false);
  };
  useEffect(() => {
    if (showModal) {
      setLoading(true);
      fetchTokenList();
      setLoading(false);
    }
  }, [showModal]);
  return (
    <div className="flex justify-center items-center">
      <button
        type="button"
        onClick={() => setShowModal(true)}
        class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
      >
        {token}
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-900 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h5 className="text-2xl text-white font-semibold">
                    Select Token
                  </h5>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <div class="relative px-2">
                    <input
                      placeholder="Search name or paste adress"
                      className="md:w-full rounded-md   py-2.5 pr-10  sm:text-sm p-2  hover:border-0"
                    />
                  </div>
                </div>
                {/*body*/}
                <div className="overflow-y-auto h-[300px] md:h-[600px] w-full scrollbar-hide">
                  <ul role="list">
                    {!loading &&
                      listtokenPair.map((res) => (
                        <div
                          key={res.address}
                          className="p-2 w-[350px] hover:bg-teal-300 hover:rounded-lg justify-center items-center"
                          onClick={() =>
                            selectId(
                              res.symbol,
                              res.logoURI,
                              res.address,
                              res.decimals
                            )
                          }
                        >
                          <div className="flex flex-row justify-between sm:flex p-2 ">
                            <div className="rounded-md ">
                              <img
                                src={res.logoURI}
                                className="w-[40px] h-[40px]"
                              ></img>
                            </div>
                            <div className="flex justify-center flex-col items-center">
                              <div>
                                <p className="text-white font-semibold">
                                  {res.symbol}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-700 text-sm font-semibold">
                                  {res.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-center items-center">
                              <p>0.1</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </ul>
                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default SelectToken2;
