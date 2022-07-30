import React from 'react';
import Start from './components/Start.js';
import Quest from './components/Quest.js';
import Confetti from 'react-confetti';


export default function App()
{
    
    const [showStart, setShowStart] = React.useState(true)
    const [score, setScore] = React.useState(0)
    const [showAnswers, setShowAnswers] = React.useState(false)
    const [questions, setQuestions] = React.useState([])
    const [allComplete, setAllComplete] = React.useState(false)
    const [playagain,setPlayAgain] = React.useState(false)
    const [dec,setDec] = React.useState(false)
    function startQuiz()
    {      
        setShowStart(false)   
        setPlayAgain(!playagain) 
    }
    
    function quitPlay(){
      setShowStart(true)
    }

    function playAgain()
    { 
      console.log(playagain)
        setPlayAgain(!playagain)
        //setShowStart(true)
        setShowAnswers(false)
        setAllComplete(false)
        
    }
    
    function checkAnswers()
    {
        setShowAnswers(true)
    }
    
    function selectAnswer(event,quest_id,option_id)
    {
        setQuestions(function(prev) {
            return(questions.map(function(quest,qid) {
                if(quest_id===qid){
                    return({...quest, selected_answer:option_id})
                }else{
                    return(quest)
                }
                
            }))
        })
    }
    
    
    React.useEffect(() => {
        var count = 0;
        for(var i = 0; i < questions.length; i++)
        {
          if (typeof questions[i].selected_answer !== 'undefined')
          {
            if(questions[i].options[questions[i].selected_answer] === questions[i].correct_answer)
            {
              count++;
            }
          }
        }
        setScore(count)
        if(count>=3){
          setDec(true)
        }
    },[showAnswers])
    
    React.useEffect(() => {
      setDec(false)
        if(showStart ===false) {
            
        fetch("https://opentdb.com/api.php?amount=5")
            .then(res => res.json())
            .then(data => setQuestions(data.results.map(function(question) {
                return({question:question.question,
                        options:question.incorrect_answers.concat([question.correct_answer]).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value),
                        selected_answer:undefined,
                        correct_answer:question.correct_answer})
            })))
            }
    }, [playagain])
    
    React.useEffect(() => { 
        setAllComplete(questions.every((quest) => typeof quest.selected_answer !== 'undefined'))
    }, [questions])
    
    const quests = questions.map(function(question,index) {
        return(<Quest
                    key={index}
                    question={question}
                    showAnswers={showAnswers}
                    selectAnswer={selectAnswer}
                    id={index}
                />)
    })
    
    
    
    return(<div className='app'>
        {showStart ? <Start startQuiz={startQuiz}/> : 
            <div className='quiz-container'>
             {dec && <Confetti/>}
                {quests}
                {showAnswers ? 
                    <div className='button-container'>
                        <h3 className='button-container-score'>{"Your score " + score + "/5 "}</h3>
                        <button className='button' onClick={playAgain}>TryAgain</button>
                        <br/>
                        
                    </div> 
                    :
                    <button className='button' disabled={!allComplete} onClick={checkAnswers}>Finish</button>}
            </div>}
            
    </div>)
}