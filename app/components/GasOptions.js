import React, { useEffect, useState } from 'react';
import SelectPicker from 'react-native-form-select-picker'; // Import the package

const GasOptions = () => {
    const [option, setOption] = useState(1)

    useEffect(() => {
    }, [option])
	return (
        <SelectPicker
            onValueChange={(value) => {
                // Do anything you want with the value. 
                // For example, save in state.
                setOption(parseInt(value))

            }}
            selected={option}
            style={{border: '1px black solid'}}
            >
            <SelectPicker.Item label="Low" value={0} style={{border: '2px black solid'}}/>	
            <SelectPicker.Item label="Medium" value={1} style={{border: '2px black solid'}}/>	
            <SelectPicker.Item label="High" value={2} style={{border: '2px black solid'}}/>	
        </SelectPicker>
    )
}

export default GasOptions;