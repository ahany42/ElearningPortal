import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ setFilter }) => {
    return (
        <Stack spacing={2} sx={{ width: 300, cursor: 'text' }}>
            <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable={false}
                options={[]}
                clearIcon={<ClearIcon sx={{ cursor: 'pointer', position: 'absolute', right: '10px' }} />}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search input"
                        sx={{
                            my: 2,
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#1d96a7',
                              },
                              '&:hover fieldset': {
                                borderColor: '#202e61',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#202e61',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              '&.Mui-focused': {
                                  color: '#000 !important',
                                  fontWeight: '700'
                              },
                            },
                          }}
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                type: 'text',
                                onChange: (e) => setFilter(e.target.value),
                            },
                        }}
                    />
                )}
            />
        </Stack>
    );
}

export default SearchBar;
