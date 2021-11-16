import React from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';


class Games extends React.Component {
  columns = [
    { field: 'number', headerName: '#' },
    { field: 'numMoves', headerName: 'Turns' },
    { field: 'numPlayers', headerName: 'Unique Players' },
    { field: 'startDate', headerName: 'Start Date' },
    { field: 'endDate', headerName: 'Last Move' }
  ]

  getRows = () => {
    const { games } = this.props;
    let rows = [];

    games.slice(0).forEach((g, i) => {
      let s = new Set();
      g.moves.forEach(m => {
        s.add(m.address);
      });

      rows.push({
        id: i,
        number: i+1 + '.',
        numMoves: Math.ceil(g.moves.length / 2),
        numPlayers: s.size,
        startDate: this.getDateString(g.timestamp),
        endDate: g.moves.length > 0 ? this.getDateString(g.moves[g.moves.length - 1].timestamp) : '',
        game: g
      });
    });

    return rows;
  }

  getDateString = (timestamp) => {
    return timestamp.getDate().toString().concat('/', timestamp.getMonth() + 1, '/', timestamp.getFullYear())
  }

  render() { 
    const { currGame, onClick, onMouseEnter, onMouseLeave } = this.props;

    return (
      <div className="text-white bg-tirsh opacity-80 rounded-lg ml-4 pl-2">
        <table>
          <colgroup>
            <col style={{width:'5%'}}/>
            <col style={{width:'15%'}}/>
            <col style={{width:'15%'}}/>
            <col style={{width:'33%'}}/>
            <col style={{width:'32%'}}/>
          </colgroup>
          <thead className="font-sans font-bold">
            <tr className="tracking-wide">
              <td className="text-left italic" colSpan="5">
                Game Archive
              </td>
            </tr>
            <tr className="tracking-tighter leading-none">
              {this.columns.map(col => {
                return (
                  <td key={col.field} >
                    {col.headerName}
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {this.getRows().map((row) =>{
              return (
                <tr 
                  key={row.id} 
                  className ="hover:bg-secondary" 
                  onMouseEnter={() => { onMouseEnter(row.game) }} 
                  onMouseLeave={() => { onMouseLeave() }}
                  onClick={() => { if(row.game !== currGame){ onClick(row.game) } }}>
                  {this.columns.map((col, i) => {
                    return (
                      <td key={col.field} align='center' size='small'>
                        {row[col.field]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      // <TableContainer sx={{ maxHeight: 450, maxWidth: 700 }}>
      //   <Table>
      //     <TableHead>
      //       <TableRow>
      //         <TableCell sx={{ fontWeight: 'bold' }} align='left' colSpan={5} size='small'>
      //           Game Archive:
      //         </TableCell>
      //       </TableRow>
      //       <TableRow>
              // {this.columns.map(col => {
              //   return (
              //     <TableCell key={col.field} sx={{ fontWeight: 'bold' }} align='center' size='small'>
              //       {col.headerName}
              //     </TableCell>
              //   );
              // })}
      //       </TableRow>
      //     </TableHead>
      //     <TableBody>
            // {this.getRows().map((row) =>{
            //   return (
            //     <TableRow key={row.id}>
            //       {this.columns.map((col, i) => {
            //         return (
            //           <TableCell key={col.field} align='center' size='small'>
            //             {row[col.field]}
            //           </TableCell>
            //         );
            //       })}
            //     </TableRow>
            //   );
            // })}
      //     </TableBody>
      //   </Table>
      // </TableContainer>
    );
  }
}
 
export default Games;