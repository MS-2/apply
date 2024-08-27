import React, { useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { SwipeableItem } from "@/components/SwipeableItem";
import { Hit } from "@/types/algoliaResponse";
import * as Animatable from 'react-native-animatable';
import { Card, Title, Paragraph, IconButton, Subheading } from 'react-native-paper';

type RenderListProps = Hit & {
    onSwipeRight?: () => Promise<void>;
    onSwipeLeft?: () => Promise<void>;
    index: number;

};

export const ArticleList: React.FC<RenderListProps> = ({
    author,
    created_at,
    story_title,
    story_url,
    story_id,
    objectID,
    onSwipeRight,
    onSwipeLeft,
    index
}) => {
    const date = new Date(created_at).toLocaleDateString()
    const [isFavorite, setIsFavorite] = useState(false);
    const handleFavoritePress = () => {
        setIsFavorite(!isFavorite); // Toggle the favorite state
    };
    return (
        <Animatable.View animation="fadeIn" duration={500} delay={index * 300} >
            <SwipeableItem
                onSwipeLeft={onSwipeLeft}
                onSwipeRight={onSwipeRight}
            >
                <Card style={{ margin: 10, elevation: 5 }}>
                    <Card.Content>
                        <Title style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }} >
                            {story_title}
                        </Title>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <IconButton
                                icon="account"
                                size={32}
                            />
                            <Subheading style={{ color: '#666' }}>
                                {author} - {date}
                            </Subheading>

                        </View>

                        <Paragraph style={{ color: '#666', marginLeft: 20 }}>
                            {JSON.stringify({ story_id, objectID }, null, 2)}
                        </Paragraph>

                    </Card.Content>
                    <Card.Actions>
                        <Link href={{ pathname: "/screens/webview", params: { value: story_url } }} asChild>
                            <IconButton
                                icon="open-in-new"
                                size={32}
                            />
                        </Link>
                        <IconButton
                            icon="star"
                            id='star'
                            size={32}
                            iconColor={isFavorite ? 'yellow' : 'gray'} // Change color based on state
                            onPress={handleFavoritePress} // Handle press event
                            animated
                        />
                    </Card.Actions>
                </Card>
            </SwipeableItem>
        </Animatable.View>
    );
};
