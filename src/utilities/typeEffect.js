import {useEffect} from 'react';

const useType = (dialogue, typeString, setTypeString) => {
    //console.log(dontType.current);
    //this works as so:
    //every 150 milisecs run:
    //set state of typed string (this is what is used by the paragraph element to display the dialogue)
    //to the sliced string 'dialogue' from index 0 (Start) to the existing string length + 1 (end)
    //since by setting the state we are changing it, the useEffect hook runs and triggers the function again
    //this continues until index out of range (However there's no error?)

    //the iterations would look like this (startIndex, endIndex) format
    //(0,0) - first letter
    //(0,1) - first two
    //(0,2) - first three
    //(0,3) etc and so on
    useEffect(() => {
        const timeout = setTimeout(() => {
        setTypeString(dialogue.slice(0, typeString.length + 1));
        
        // console.log(`total question: ${totalQuestionNumber.current}, questionNumber: ${questionNumber}`);
        // if(dontType.current){
        //     //check if typestring has all the characters and if not reached end of quiz
        //     if(typeString == dialogue && questionNumber != totalQuestionNumber.current-1){
        //         setQuestionNumber(questionNumber + 1);
        //     }
        // }else{
        //     dontType.current = false;
        // }
        

    }, 40);

    //when unmounting componenet clear timeout
        return () => {clearTimeout(timeout)}
    }, [typeString, dialogue])
    
}

export default useType;