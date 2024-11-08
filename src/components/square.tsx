import "./squaree.css"
import React from 'react';
interface SquareProps {
    value: string | null;
    callback: () => void;
  }
  const Square: React.FC<SquareProps>=({value,callback})=>{
    return (
        <>
            <div className="Square" onClick={callback}>{value?value:null}</div>
        </>
    )
}
export default Square