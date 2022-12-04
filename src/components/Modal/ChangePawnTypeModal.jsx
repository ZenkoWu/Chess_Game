import './ChangePawnTypeModal.css'

export const ChangePawnTypeModal = ({getFigureClasses, candidates, changePawnType, color}) => {
    const PotentialPawnTypes = ({type, color}) => {
        return (
            <div className={' col-3 fs-100'}>
                <i 
                    className={getFigureClasses(null, 'shadow', type, color) + ' cursor'} 
                    onClick={() => changePawnType(type, color)}
                />
            </div>
        )
    }
    return (
        <div className="modalWindow rounded-3 w-75 ">
            <div className="text-white fw-bold fs-5 py-1">Превратить пешку в</div>
            <div className=" py-4">
                <div className="row mw-100 m-0">
                    {candidates.map(candidate => 
                        <PotentialPawnTypes type={candidate} key={candidate} color={color}/>
                    )}
                </div>
            </div>
        </div>
    )
}