import React from 'react';

const Error = ({ error }) => {
    if (typeof error.detail === 'string') {
        return (
            <div className="alert alert-danger" role="alert">
                <div>
                    {error.detail}
                </div>
            </div>
        );
    } else if (typeof error.detail === 'object' && error.detail.length > 0) {
        return (
            <div className="alert alert-danger" role="alert">
                {error.detail.map((err, i) => (
                    <div key={i}>
                        <strong>{err.loc[1]}</strong> : {err.msg}
                    </div>
                ))}
            </div>
        );
    } else {
        return null; // 오류가 없는 경우 아무것도 렌더링하지 않음
    }
};

export default Error;
