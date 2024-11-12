import React, { memo } from 'react';
interface CellProps {
    value: string;
    onClick: () => void;
}
/**
 * 棋子
 */
const Cell: React.FC<CellProps> = memo(({ value, onClick }) => {
    return (
        <td onClick={onClick}>
            {value}
        </td>
    );
});

export default Cell;
