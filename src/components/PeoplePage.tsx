import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline, max-len
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { getPeople } from '../api';
import { Person } from '../types';
import { PeopleFilters } from './PeopleFilters';
import { Loader } from './Loader';
import { PeopleTable } from './PeopleTable';

export const PeoplePage: React.FC = () => {
  const [loadedPeople, setLoadedPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [requestStatus, setRequestStatus] = useState(false);
  const [searchParams] = useSearchParams();

  const { id = '' } = useParams();
  const location = useLocation();
  // const parentPath = useResolvedPath('../').pathname;

  const loadPeople = () => {
    setLoading(true);
    getPeople()
      .then(people => {
        setLoadedPeople(people);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        setRequestStatus(true);
      });
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const filteredPeople = () => {
    let res = loadedPeople.filter(
      (person) => {
        switch (searchParams.get('sex')) {
          case 'm':
            return person.sex === 'm';
            break;
          case 'f':
            return person.sex === 'f';
            break;
          default:
            return true;
        }
      },
    );

    if (searchParams.get('sort') !== null) {
      // const sortKey = searchParams.get('sort');

      if (searchParams.get('sort') === 'name') {
        res = res.sort((a, b) => {
          if (searchParams.get('order') === 'desc') {
            return ((b.name).localeCompare(a.name));
          }

          return ((a.name).localeCompare(b.name));
        });
      } else if (searchParams.get('sort') === 'sex') {
        res = res.sort((a, b) => {
          if (searchParams.get('order') === 'desc') {
            return ((b.sex).localeCompare(a.sex));
          }

          return ((a.sex).localeCompare(b.sex));
        });
      } else if (searchParams.get('sort') === 'born') {
        res = res.sort((a, b) => {
          if (searchParams.get('order') === 'desc') {
            return ((b.born) - (a.born));
          }

          return ((a.born) - (b.born));
        });
      } else if (searchParams.get('sort') === 'died') {
        res = res.sort((a, b) => {
          if (searchParams.get('order') === 'desc') {
            return ((b.died) - (a.died));
          }

          return ((a.died) - (b.died));
        });
      }
      /*
      else {
        res = res.sort((a, b) => {
          if (searchParams.get('order') === 'desc') {
            return b[sortKey] - a[sortKey];
          }

          return a[sortKey] - b[sortKey];
        });
      }
      */
    }

    return res;
  };

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          <div className="column is-7-tablet is-narrow-desktop">
            <PeopleFilters />
          </div>

          <div className="column">
            <div className="box table-container">
              {loading && <Loader />}

              {error && (
                <p data-cy="peopleLoadingError" className="has-text-danger">
                  Something went wrong
                </p>
              )}

              <h1 className="title">
                {location.pathname}
                <br />
                {location.search}
                <br />
                Search Params - &#160;
                {searchParams.toString()}
              </h1>
              <p>There are no people matching the current search criteria</p>

              {requestStatus
                && (
                  <PeopleTable
                    allPeople={loadedPeople}
                    people={filteredPeople()}
                    slug={id}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
