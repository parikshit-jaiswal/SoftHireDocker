const DetailSection = ({ title, children }) =>{
    return (
      <div className="mb-6">
        <h3 className="font-bold mb-2">{title}</h3>
        <div className="text-sm text-gray-700">{children}</div>
      </div>
    );
  }

export default DetailSection