import React from 'react';
import './castInput.css';
export default function castInput(props) {
    const inputs = props.languages.map(element=>{
        return (
            <React.Fragment>
                <input value={element[element.name]} name={element.name} onChange={props.change} placeholder='Resultion'></input>
                <input onChange={props.handlerFile} type="file" name={element[element.name+'File']}></input>
                <button onClick={()=>{props.remove(element.name)}}>remove</button>
            </React.Fragment>
        )
    })
    return (
        <div>
            {inputs}
        </div>
    )
}
