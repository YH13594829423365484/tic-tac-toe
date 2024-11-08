import React from 'react';
import {Link} from 'react-router-dom';
import Table from '../components/table';
const Gobang = () => {
  return (
    <>
        <Link to="/">返回首页</Link>
        <div>
            <Table></Table>
        </div>
    </>
  )
};

export default Gobang;

// 棋盘为 15x15 的方格。⚫⚪
// 黑棋先下，黑白双方轮流交替下子，直到黑白中任意一方获胜。
// 黑棋第一步必须走天元（图中黑点）。
// 每人一次下一子，一次只能下一个棋子。
// 获胜的判定：只要黑白方中任意一方的棋子有五子连在一起（即五子连珠），可以为横连、纵连、斜连，则该方获胜，游戏结束。