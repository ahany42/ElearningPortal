import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ setFilter }) => {
    return (
        <Stack spacing={2} sx={{ width: 300 }}>
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
                        sx={{ backgroundColor: '#f9f9f9' }}
                        InputLabelProps={{
                            sx: { userSelect: 'none' },
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
