export const Modal = ({getFigureClasses, setPawnType}) => {
    return (
        <div className="moda rounded-3 w-75 ">
            <div className="text-white fw-bold fs-4 py-1">Превратить пешку в:</div>
            <div className=" py-4">
                <div className="row mw-100 m-0">
                    <div className={' col-3 fs-100'}>
                        <i className={getFigureClasses(20, 'shadow') + ' cursor'} />
                    </div>
                    <div className={' col-3 fs-100'}>
                        <i className={getFigureClasses(22, 'shadow') + ' cursor'}/>
                    </div>
                    <div className={' col-3 fs-100'}>
                        <i className={getFigureClasses(18, 'shadow') + ' cursor'}/>
                    </div>
                    <div className={' col-3 fs-100'}>
                        <i className={getFigureClasses(23, 'shadow') + ' cursor'}/>
                    </div>
            </div>
            </div>
            
        </div>
    )
}