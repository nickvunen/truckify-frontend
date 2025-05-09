import React from 'react';

const getQuery = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

const getQueryStringVal = (key: string): string | null => {
  return getQuery().get(key);
};

const useQueryParam = (
  key: string
): [string | null, (val: string | null) => void] => {
  const [query, setQuery] = React.useState(getQueryStringVal(key) || null);

  const updateQuery = (newVal: string | null) => {
    setQuery(newVal);

    const query = getQuery();

    if (newVal !== null && newVal.trim() !== '') {
      query.set(key, newVal);
    } else {
      query.delete(key);
    }

    // This check is necessary if using the hook with Gatsby
    if (typeof window !== 'undefined') {
      const { protocol, pathname, host } = window.location;
      const newUrl = `${protocol}//${host}${pathname}?${query.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  return [query, updateQuery];
};

export default useQueryParam;