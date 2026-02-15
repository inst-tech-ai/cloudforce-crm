import React from 'react';

export const FormField = ({ label, children }) => (<div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>);
export const Input = ({ type = "text", ...props }) => (<input type={type} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#0176d3] outline-none" {...props} />);
export const Select = ({ options, ...props }) => (<select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#0176d3] outline-none" {...props}>{options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>);
export const TextArea = ({ ...props }) => (<textarea className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#0176d3] outline-none" rows={3} {...props} />);
