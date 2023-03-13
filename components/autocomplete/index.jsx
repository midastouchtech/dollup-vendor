import AutoComplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
   

const PlacesAutoComplete = ({onChange, value, onSelect}) => {
    const handleChange = (address) => {
        onChange(address);
      };
    
      const handleSelect = (address) => {
        geocodeByAddress(address)
          .then((results) => getLatLng(results[0]))
          .then((latLng) => {
            console.log("selecting", address)
            onSelect(address, latLng)
          })
          .catch((error) => console.error("Error", error));
        
      };

    return (<AutoComplete
        apiKey={"AIzaSyDka_7ppWokFIBPOxpKQ41NfgP6Q1Q3JBM"}
        value={value}
        onChange={handleChange}
        onSelect={handleSelect}
        searchOptions={{
          types: ["address"],
          componentRestrictions: {
            country: ["za"],
          },
        }}
      >
        {({
          getInputProps,
          suggestions,
          getSuggestionItemProps,
          loading,
        }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "form-control location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </AutoComplete>)
}

export default PlacesAutoComplete;