import React, { useEffect, useState } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

const ProfileSidebar = (props) => {
  return (
    <Box as="aside">
        <img src={`https://github.com/${props.usrGitHub}.png`} style={{ borderRadius: '8px' }} />
        <hr />

        <p>
          <a className="boxLink" href={`https://github.com/${props.usrGitHub}`}>
            @{props.usrGitHub}
          </a>
        </p>
        <hr />

        <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">{props.title} ({props.items.length})</h2>
      <ul>
        {/*
          pessoasFavoritas.map((pessoa) => {
            return (
              <li key={pessoa}>
                <a href={`/users/${pessoa}`}>
                  <img src={`https://github.com/${pessoa}.png`} />
                  <span>{pessoa}</span>
                </a>
              </li>
            );
          })
            */}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  
  const [comunidades, setComunidades] = useState([]);
  const usrGitHub = 'denerthiago21';
  const pessoasFavoritas = [
    'filipedeschamps',
    'diego3g',
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ];

  const [seguidores, setSeguidores] = useState([]);

  useEffect(() => {
    // GET
    fetch(`https://api.github.com/users/${usrGitHub}/followers`)
    .then((response) => {
      return (response.json());
    })
    .then((completeResponse) => {
      setSeguidores(completeResponse);
    });

    // GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'authorization': '6a391118be936de17a677ba3503915',
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({'query': `query {
        allCommunities {
          id
          title
          image
          creatorSlug
        }
      }`})
    })
    .then((response) => response.json())
    .then((response) => {
      const comunidadesDaAPI = response.data.allCommunities;
      setComunidades(comunidadesDaAPI);
    });
    
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={usrGitHub} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar usrGitHub={usrGitHub} />    
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1>Bem-Vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={function handleCriaComunidade(e){
              e.preventDefault();
              const dadosForm = new FormData(e.target);

              const comunidade = {
                id: new Date().toISOString(),
                title: dadosForm.get('title'),
                image: dadosForm.get('image'),
              }

              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);

            }}>
              <div>
                <input 
                  placeholder="qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder="Insira uma URL para servir com capa" 
                  name="image" 
                  aria-label="Insira uma URL para servir com capa"
                  type="text"
                />
              </div>
              <button>Criar Comunidade</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">comunidades ({comunidades.length})</h2>
            <ul>
              {
                comunidades.map((comunidade) => {
                  return (
                    <li  key={comunidade.id}>
                      <a href={`/communities/${comunidade.id}`}>
                        <img src={comunidade.image} /> 
                        <span>{comunidade.title}</span>
                      </a>
                    </li>
                  );
                })
              }
            </ul>
          </ProfileRelationsBoxWrapper>
          
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Pessoas da Comunidade ({pessoasFavoritas.length})</h2>
            <ul>
              {
                pessoasFavoritas.map((pessoa) => {
                  return (
                    <li key={pessoa}>
                      <a href={`/users/${pessoa}`}>
                        <img src={`https://github.com/${pessoa}.png`} />
                        <span>{pessoa}</span>
                      </a>
                    </li>
                  );
                })
              }
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
