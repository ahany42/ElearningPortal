import {
    TextField,
  } from "@mui/material";
import { FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useState } from 'react';
const Question = ({formData,setFormData}) => {
    const [value,setValue] = useState(null);
    const handleChange = (event)=>{
        setValue(event.target.value);
      }
  return (
    <>
       <TextField label="Question Title"
                   name="title"
                   fullWidth type="text" value={formData.title}
                   onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,title: e.target.value});
                       setError('');
                       toast.dismiss();
                   }}
                   required
            sx={{
              my: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey',
                },
                '&:hover fieldset': {
                  borderColor: '#274546',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#274546',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#274546 !important',
                },
              },
            }}
          />
          <TextField label="Choice 1"
                   name="answer1"
                   fullWidth type="text" value={formData.title}
                   onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,title: e.target.value});
                       setError('');
                       toast.dismiss();
                   }}
                   required
            sx={{
              my: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey',
                },
                '&:hover fieldset': {
                  borderColor: '#274546',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#274546',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#274546 !important',
                },
              },
            }}
          />
          <TextField label="Choice 2"
                   name="answer2"
                   fullWidth type="text" value={formData.title}
                   onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,title: e.target.value});
                       setError('');
                       toast.dismiss();
                   }}
                   required
            sx={{
              my: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey',
                },
                '&:hover fieldset': {
                  borderColor: '#274546',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#274546',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#274546 !important',
                },
              },
            }}
          />
          <TextField label="Choice 3"
                   name="answer3"
                   fullWidth type="text" value={formData.title}
                   onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,title: e.target.value});
                       setError('');
                       toast.dismiss();
                   }}
                   required
            sx={{
              my: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey',
                },
                '&:hover fieldset': {
                  borderColor: '#274546',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#274546',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#274546 !important',
                },
              },
            }}
          />
          <TextField label="Choice 4"
                   name="answer4"
                   fullWidth type="text" value={formData.title}
                   onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,title: e.target.value});
                       setError('');
                       toast.dismiss();
                   }}
                   required
            sx={{
              my: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey',
                },
                '&:hover fieldset': {
                  borderColor: '#274546',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#274546',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#274546 !important',
                },
              },
            }}
          />
        <FormLabel component="legend">Correct Answer</FormLabel>
       <RadioGroup
        aria-label="mcq"
        name="mcq"
        value={value}
        onChange={handleChange}
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        <FormControlLabel value="choice1" control={<Radio />} label="Choice 1" />
        <FormControlLabel value="choice2" control={<Radio />} label="Choice 2" />
        <FormControlLabel value="choice3" control={<Radio />} label="Choice 3" />
        <FormControlLabel value="choice4" control={<Radio />} label="Choice 4" />
      </RadioGroup>
    <hr/>
    </>
  )
}

export default Question
