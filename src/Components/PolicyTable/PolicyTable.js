import React from "react";
import MaterialTable from "material-table";
import './PolicyTable.css'

const PolicyTable = (props) => {
    return (
        <div className="policy-table">
            <MaterialTable
                title="Insurance Policy"
                data={props.policies}
                columns={props.cols}
                editable={{
                    onRowUpdate: (updatedData, oldData) => props.updatePolicy(updatedData)
                }}
                options={{
                    exportButton: true,
                    search: false,
                    headerStyle: {
                        color: 'Black',
                        whiteSpace: 'nowrap'
                    },
                    paging: false
                }}
            />
        </div>
    )
}

export default PolicyTable;