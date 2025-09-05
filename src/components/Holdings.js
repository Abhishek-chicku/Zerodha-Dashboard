import React, { useState, useEffect } from "react";
import axios from "axios";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/allHoldings", {
          withCredentials: true,
        });

        // Ensure each holding has valid numeric values
        const sanitized = data.map((stock) => ({
          name: stock.name || "Unknown",
          qty: stock.qty ?? 0,
          avg: stock.avg ?? 0,
          price: stock.price ?? 0,
          net: stock.net || "+0.00%",
          day: stock.day || "+0.00%",
          isLoss: stock.isLoss || false,
        }));

        setAllHoldings(sanitized);
      } catch (err) {
        console.error("Holdings fetch error:", err);
      }
    };

    fetchHoldings();
  }, []);

  return (
    <>
      <h3>Holdings ({allHoldings.length})</h3>
      <table>
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>
        </thead>
        <tbody>
          {allHoldings.map((stock, index) => {
            const curValue = stock.price * stock.qty;
            const pnl = curValue - stock.avg * stock.qty;
            const isProfit = pnl >= 0;

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{Number(stock.avg).toFixed(2)}</td>
                <td>{Number(stock.price).toFixed(2)}</td>
                <td>{curValue.toFixed(2)}</td>
                <td style={{ color: isProfit ? "green" : "red" }}>
                  {pnl.toFixed(2)}
                </td>
                <td style={{ color: isProfit ? "green" : "red" }}>
                  {stock.net}
                </td>
                <td style={{ color: stock.isLoss ? "red" : "green" }}>
                  {stock.day}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Holdings;
