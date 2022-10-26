function Errors({ errors }) {
    return (
        <div className="container">
            <div className="row">
                {errors !== "" && (
                    <div className="col-12 py-5">
                        <div className="alert alert-danger">
                            {errors.message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Errors;
