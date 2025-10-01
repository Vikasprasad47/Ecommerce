import React from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const DisplayTable = ({ data, column, loading }) => {
    const table = useReactTable({
        data,
        columns: column,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-0 overflow-auto w-full">
            {loading ? (
                <div className="p-6 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            ) : data.length === 0 ? (
                <div className="p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No subcategories found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new subcategory.</p>
                </div>
            ) : (
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                {headerGroup.headers.map(header => (
                                    <th 
                                        key={header.id} 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row, index) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {index + 1}
                                </td>
                                {row.getVisibleCells().map(cell => (
                                    <td 
                                        key={cell.id} 
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DisplayTable;