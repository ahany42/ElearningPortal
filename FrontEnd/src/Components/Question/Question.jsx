import {
    TextField,
  } from "@mui/material";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useState } from 'react';
const Question = (formData) => {
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
        <FormControlLabel value="answer1" control={<Radio />} label="Answer 1" />
        <FormControlLabel value="answer2" control={<Radio />} label="Answer 2" />
        <FormControlLabel value="answer3" control={<Radio />} label="Answer 3" />
        <FormControlLabel value="answer4" control={<Radio />} label="Answer 4" />
      </RadioGroup>
    <hr/>
    </>
  )
}

export default Question
