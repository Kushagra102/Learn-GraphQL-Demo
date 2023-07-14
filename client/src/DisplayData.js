import React, { useState } from 'react'
import { useQuery, useLazyQuery, gql, useMutation } from '@apollo/client'

const QUERY_ALL_USERS = gql`
    query GetAllUsers{
    users {
        id
        name
        age
        username
        nationality
    }
}
`

const QUERY_ALL_MOVIES = gql`
    query GetAllMovies{
    movies {
        id
        name
        yearOfPublication
        isInTheaters
    }
}
`

const GET_MOVIE_BY_NAME = gql`
    query Movie($name: String!){
    movie(name: $name) {
        name
        yearOfPublication
    }
}
`

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!){
    createUser(input: $input) {
        id
        name
    }
}
`

function DisplayData() {

    // Create User States
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [age, setAge] = useState(0)
    const [nationality, setNationality] = useState('')
    const [createUser] = useMutation(CREATE_USER_MUTATION)

    const [movieSearched, setMovieSearched] = useState('')

    const { data, loading, refetch } = useQuery(QUERY_ALL_USERS)
    const { data: movieData } = useQuery(QUERY_ALL_MOVIES)
    const [fetchMovie, { data: movieSearchedData, error: movieError }] = useLazyQuery(GET_MOVIE_BY_NAME)

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (data) {
        console.log(data)
    }

    if (movieSearchedData) {
        console.log(movieSearchedData)
    }

    if (movieError) {
        console.log(movieError)
    }



    return (
        <div>
            <div>
                <input type="text" placeholder='name' onChange={(event) => {
                    setName(event.target.value)
                }} />
                <input type="text" placeholder='username' onChange={(event) => {
                    setUsername(event.target.value)
                }} />
                <input type="number" placeholder='age' onChange={(event) => {
                    setAge(event.target.value)
                }} />
                <input type="text" placeholder='nationality' onChange={(event) => {
                    setNationality(event.target.value.toUpperCase())
                }} />
                <button onClick={() => {createUser({
                    variables: {input: { name, username, age: Number(age), nationality}}}
                    );
                    refetch()
                    }}>Create User</button>
            </div>
            {data && data.users.map((user) => {
                return <div>
                    <h1>Name: {user.name}</h1>
                    <h1>Username: {user.username}</h1>
                    <h1>Age: {user.age}</h1>
                    <h1>Nationality: {user.nationality}</h1>
                </div>
            })}

            {movieData && movieData.movies.map((movie) => {
                return <div>
                    <h1>Name: {movie.name}</h1>
                    <h1>Year of Publication: {movie.yearOfPublication}</h1>
                    <h1>Is in Theaters: {movie.isInTheaters ? "yes" : "no"}</h1>
                </div>
            })
            }

            <div>
                <input type="text" placeholder='Interstellar...' onChange={(e) => { setMovieSearched(e.target.value) }} />
                <button onClick={() => {
                    fetchMovie({
                        variables: {
                            name: movieSearched,
                        }
                    })
                }}
                >
                    Fetch Data </button>
                <div>
                    {movieSearchedData && (
                        <div>
                            <h1>MovieName: {movieSearchedData.movie.name}</h1>
                            <h1>Year Of Publication: {movieSearchedData.movie.yearOfPublication}</h1>
                        </div>
                    )}
                    {movieError && <h1>Movie does not exist in database or there was an error fetching the data</h1>}
                </div>
            </div>
        </div>
    )
}

export default DisplayData