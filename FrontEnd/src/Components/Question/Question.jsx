import {TextField} from "@mui/material";
import { FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
const Question = ({formData,setFormData}) => {
  return (
    <>
       <TextField label="Question Title"
                   name="title"
                   fullWidth type="text" value={formData.title || ''}
                  //  onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,title: e.target.value});
                      //  setError('');
                      //  toast.dismiss();
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
                   fullWidth type="text" value={formData.answer1 || ''}
                  //  onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,answer1: e.target.value});
                      //  setError('');
                      //  toast.dismiss();
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
                   fullWidth type="text" value={formData.answer2 || ''}
                  //  onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,answer2: e.target.value});
                      //  setError('');
                      //  toast.dismiss();
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
                   fullWidth type="text" value={formData.answer3 || ''}
                  //  onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,answer3: e.target.value});
                      //  setError('');
                      //  toast.dismiss();
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
                   fullWidth type="text" value={formData.answer4 ||''}
                  //  onKeyDown={(e) => handleKeyPress(e, 'title')}
                   onChange={(e) => {
                       setFormData({...formData,answer4: e.target.value});
                      //  setError('');
                      //  toast.dismiss();
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
        value={formData.correctAnswer || ''}
        onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        <FormControlLabel value="answer1" control={<Radio />} label="Choice 1" />
        <FormControlLabel value="answer2" control={<Radio />} label="Choice 2" />
        <FormControlLabel value="answer3"control={<Radio />} label="Choice 3" />
        <FormControlLabel value="answer4"control={<Radio />} label="Choice 4" />
      </RadioGroup>
    </>
  )
}

export default Question
