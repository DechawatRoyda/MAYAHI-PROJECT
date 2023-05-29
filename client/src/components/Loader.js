import { React, useState} from 'react'
import PulseLoader from "react-spinners/PulseLoader";

function Loader() {
    let [loading, setLoading] = useState(true);

    return (
        <div style={{marginTop:'250px'}}>
            <div className="sweet-loading text-center">
                <PulseLoader
                    color='#000000'
                    loading={loading}
                    cssOverride=''
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </div>
    )
}

export default Loader