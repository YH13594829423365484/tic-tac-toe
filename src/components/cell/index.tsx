import React, { memo } from 'react';
interface CellProps {
    row: number;
    col: number;
    value: string | null;
    onClick: (row: number, col: number) => void;
}
/**
* 棋子
*/
const Cell: React.FC<CellProps> = memo(({ row, col, value, onClick }) => {
    return (
        <td onClick={() => onClick(row, col)}>
            {value}
        </td>
    );
});
export default Cell;
