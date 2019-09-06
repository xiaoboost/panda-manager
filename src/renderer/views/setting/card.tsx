import { default as React, PropsWithChildren } from 'react';

interface CardProps {
    title: string;
}

export default function Card(props: PropsWithChildren<CardProps>) {
    return (
        <section className='setting-section'>
            <header className='setting-title'>{props.title}</header>
            <article className='setting-card'>{props.children}</article>
        </section>
    );
}
