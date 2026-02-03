import React from "react";

interface RegisterTemplateProps {
  firstname: string;
  verificationCode: string;
}

const RegisterTemplate: React.FC<RegisterTemplateProps> = ({ 
  firstname, 
  verificationCode 
}) => {
  return React.createElement('div', {
    style: { 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }
  }, [
    React.createElement('div', {
      key: 'container',
      style: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }
    }, [
      // Header
      React.createElement('div', {
        key: 'header',
        style: { textAlign: 'center', marginBottom: '30px' }
      }, [
        React.createElement('h1', {
          key: 'title',
          style: { 
            color: '#A36F5E', 
            fontSize: '28px', 
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }
        }, 'Bienvenue chez Yodi Cosmetics !'),
        React.createElement('p', {
          key: 'subtitle',
          style: { 
            color: '#666', 
            fontSize: '16px', 
            margin: '0' 
          }
        }, 'Votre compte a été créé avec succès')
      ]),

      // Message principal
      React.createElement('div', {
        key: 'message',
        style: { marginBottom: '30px' }
      }, [
        React.createElement('p', {
          key: 'greeting',
          style: { 
            color: '#333', 
            fontSize: '16px', 
            lineHeight: '1.6',
            margin: '0 0 20px 0'
          }
        }, `Bonjour ${firstname},`),
        React.createElement('p', {
          key: 'description',
          style: { 
            color: '#333', 
            fontSize: '16px', 
            lineHeight: '1.6',
            margin: '0 0 20px 0'
          }
        }, 'Merci de vous être inscrit sur notre plateforme ! Pour finaliser votre inscription et activer votre compte, veuillez utiliser le code de vérification ci-dessous :')
      ]),

      // Code de vérification
      React.createElement('div', {
        key: 'code',
        style: { 
          textAlign: 'center', 
          margin: '30px 0',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #A36F5E'
        }
      }, [
        React.createElement('p', {
          key: 'code-label',
          style: { 
            color: '#666', 
            fontSize: '14px', 
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }
        }, 'Votre code de vérification :'),
        React.createElement('div', {
          key: 'code-value',
          style: {
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#A36F5E',
            letterSpacing: '8px',
            fontFamily: 'monospace',
            backgroundColor: 'white',
            padding: '15px 20px',
            borderRadius: '6px',
            display: 'inline-block',
            border: '1px solid #ddd'
          }
        }, verificationCode)
      ]),

      // Instructions
      React.createElement('div', {
        key: 'instructions',
        style: { marginBottom: '30px' }
      }, [
        React.createElement('p', {
          key: 'instructions-title',
          style: { 
            color: '#333', 
            fontSize: '14px', 
            lineHeight: '1.6',
            margin: '0 0 15px 0'
          }
        }, 'Instructions :'),
        React.createElement('ul', {
          key: 'instructions-list',
          style: { 
            color: '#666', 
            fontSize: '14px', 
            lineHeight: '1.6',
            margin: '0',
            paddingLeft: '20px'
          }
        }, [
          React.createElement('li', { key: 'inst1' }, 'Ce code est valide pendant 30 minutes'),
          React.createElement('li', { key: 'inst2' }, 'Entrez ce code sur la page de vérification'),
          React.createElement('li', { key: 'inst3' }, 'Ne partagez jamais ce code avec d\'autres personnes')
        ])
      ]),

      // Bouton d'action
      React.createElement('div', {
        key: 'button',
        style: { textAlign: 'center', margin: '30px 0' }
      }, [
        React.createElement('a', {
          key: 'verify-button',
          href: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verification`,
          style: {
            display: 'inline-block',
            backgroundColor: '#A36F5E',
            color: 'white',
            padding: '12px 30px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '16px'
          }
        }, 'Vérifier mon compte')
      ]),

      // Footer
      React.createElement('div', {
        key: 'footer',
        style: { 
          borderTop: '1px solid #eee', 
          paddingTop: '20px', 
          textAlign: 'center' 
        }
      }, [
        React.createElement('p', {
          key: 'footer-text1',
          style: { 
            color: '#999', 
            fontSize: '12px', 
            margin: '0 0 10px 0'
          }
        }, 'Si vous n\'avez pas créé de compte sur Yodi Cosmetics, ignorez cet email.'),
        React.createElement('p', {
          key: 'footer-text2',
          style: { 
            color: '#999', 
            fontSize: '12px', 
            margin: '0' 
          }
        }, '© 2024 Yodi Cosmetics. Tous droits réservés.')
      ])
    ])
  ]);
};

export default RegisterTemplate;
